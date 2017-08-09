<?php

namespace AppBundle\Component\Export;

use AppBundle\Common\ArrayToolkit;

class InviteUserRecordsExporter extends Exporter
{
    public function getTitles()
    {
        return array('用户名', '邀请人数', '付费用户数', '订单消费总额', '订单虚拟币总额	', '订单现金总额');
    }

    public function canExport()
    {
        $user = $this->getUser();

        if ($user->hasPermission('admin_operation_invite_user')) {
            return true;
        }

        return false;
    }

    public function getCount()
    {
        return $count = $this->getUserService()->countUsers($this->conditions);
    }

    public function getContent($start, $limit)
    {
        $conditions = $this->conditions;
        $users = $this->getUserService()->searchUsers(
            $conditions,
            array('id' => 'ASC'),
            $start,
            $limit
        );

        $userRecordData = $this->getInviteRecordService()->getInviteInformationsByUsers($users);
        $userRecordData = $this->getUserRecordContent($userRecordData);

        return $userRecordData;
    }

    protected function getUserRecordContent($records)
    {
        $data = array();
        foreach ($records as $userRecordData) {
            $content = array();
            $content[] = $userRecordData['nickname'];
            $content[] = $userRecordData['count'];
            $content[] = $userRecordData['payingUserCount'];
            $content[] = $userRecordData['payingUserTotalPrice'];
            $content[] = $userRecordData['coinAmountPrice'];
            $content[] = $userRecordData['amountPrice'];
            $data[] = $content;
        }

        return $data;
    }

    public function buildCondition($conditions)
    {
        return ArrayToolkit::parts($conditions, array('nickname'));
    }

    protected function getUserService()
    {
        return $this->getBiz()->service('User:UserService');
    }

    protected function getInviteRecordService()
    {
        return $this->getBiz()->service('User:InviteRecordService');
    }

    protected function getSettingService()
    {
        return $this->getBiz()->service('System:SettingService');
    }
}