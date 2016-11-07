<?php

namespace Topxia\Api\Resource\IM;

use Silex\Application;
use Topxia\Common\ArrayToolkit;
use Topxia\Api\Resource\BaseResource;
use Symfony\Component\HttpFoundation\Request;

class MemberSync extends BaseResource
{
    public function post(Application $app, Request $request)
    {
        $setting = $this->getSettingservice()->get('app_im', array());
        if (empty($setting['enabled'])) {
            return $this->error('700008', '网站会话未启用');
        }

        $user = $this->getCurrentUser();

        $this->syncClassroomConversations($user);
        $this->syncCourseConversations($user);

        return $this->joinGlobalConversation($user);
    }

    public function filter($res)
    {
        return $res;
    }

    protected function joinGlobalConversation($user)
    {
        $conv = $this->getConversationService()->getConversationByTarget(0, 'global');
        if (!$conv) {
            return $this->error('700007', '全站会话未创建');
        }

        $convMember = $this->getConversationService()->getMemberByConvNoAndUserId($conv['no'], $user['id']);
        if ($convMember) {
            return array('convNo' => $convMember['convNo']);
        }

        try {
            $convMember = $this->getConversationService()->joinConversation($conv['no'], $user['id']);
            return array('convNo' => $convMember['convNo']);
        } catch (\Exception $e) {
            return $this->error($e->getCode(), $e->getMessage());
        }
    }

    protected function syncCourseConversations($user)
    {
        $count   = $this->getCourseService()->findUserLearnCourseCount($user['id']);
        $courses = $this->getCourseService()->findUserLearnCourses($user['id'], 0, $count);

        $courseIds = ArrayToolkit::column($courses, 'id');

        $this->syncTargetConversations($user, $courses, 'course');
        $this->syncCourseConversationMembers($user, $courseIds);
    }

    protected function syncClassroomConversations($user)
    {
        $classroomIds = $this->getClassroomService()->findUserJoinedClassroomIds($user['id']);
        $classrooms   = $this->getClassroomService()->findClassroomsByIds($classroomIds);

        $this->syncTargetConversations($user, $classrooms, 'classroom');
        $this->syncClassroomConversationMembers($user, $classroomIds);
    }

    protected function syncCourseConversationMembers($user, $courseIds)
    {
        $convMembers = $this->getConversationService()->findMembersByUserIdAndTargetType($user['id'], 'course');

        if (!$convMembers) {
            return;
        }

        foreach ($convMembers as $convMember) {
            if (!in_array($convMember['targetId'], $courseIds)) {
                $this->getConversationService()->quitConversation($convMember['convNo'], $convMember['userId']);
            }
        }
    }

    protected function syncClassroomConversationMembers($user, $classroomIds)
    {
        $convMembers = $this->getConversationService()->findMembersByUserIdAndTargetType($user['id'], 'classroom');

        if (!$convMembers) {
            return;
        }

        foreach ($convMembers as $convMember) {
            if (!in_array($convMember['targetId'], $classroomIds)) {
                $this->getConversationService()->quitConversation($convMember['convNo'], $convMember['userId']);
            }
        }
    }

    protected function syncTargetConversations($user, $targets, $targetType)
    {
        $targetMap = ArrayToolkit::index($targets, 'id');
        $userConvs = $this->getConversationService()->findMembersByUserIdAndTargetType($user['id'], $targetType.'-push');
        if (empty($targetMap)) {
            foreach ($userConvs as $uc) {
                $this->getConversationService()->quitConversation($uc['convNo'], $user['id']);
            }
            return;
        }
        $params = array(
            'targetIds'   => array_keys($targetMap),
            'targetTypes' => array($targetType.'-push')
        );
        $count          = $this->getConversationService()->searchConversationCount($params);
        $targetConvs    = $this->getConversationService()->searchConversations($params, array('createdTime', 'asc'), 0, $count);
        $targetConvsMap = ArrayToolkit::index($targetConvs, 'targetId');
        foreach ($targetMap as $id => $target) {
            if (!isset($targetConvsMap[$id])) {
                $this->getConversationService()->createConversation('推送：'.$targetMap[$id]['title'], $targetType.'-push', $id, array($user));
            }
        }
        $userConvsMap = ArrayToolkit::index($userConvs, 'targetId');
        foreach ($targetMap as $id => $target) {
            if (!isset($userConvsMap[$id])) {
                $this->getConversationService()->joinConversation($targetConvsMap[$id]['no'], $user['id']);
            }
        }
        foreach ($userConvsMap as $id => $uesrConv) {
            if (!isset($targetMap[$id])) {
                $this->getConversationService()->quitConversation($userConvsMap[$id]['convNo'], $user['id']);
            }
        }
    }

    protected function getConversationService()
    {
        return $this->getServiceKernel()->createService('IM.ConversationService');
    }

    private function getSettingService()
    {
        return $this->getServiceKernel()->createService('System.SettingService');
    }

    protected function getClassroomService()
    {
        return $this->getServiceKernel()->createService('Classroom:Classroom.ClassroomService');
    }

    protected function getCourseService()
    {
        return $this->getServiceKernel()->createService('Course.CourseService');
    }
}
