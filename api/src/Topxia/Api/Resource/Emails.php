<?php 

namespace Topxia\Api\Resource;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;
use Topxia\Service\Common\Mail\MailFactory;

class Emails extends BaseResource
{
    public function post(Application $app, Request $request)
    {
        $data = $request->request->all();
        $user = $this->getUserService()->getUserByEmail($data['email']);
        if (!$user) {
            return $this->error('5003', '该邮箱未在网校注册');
        }

        $salt = base_convert(sha1(uniqid(mt_rand(), true)), 16, 36);
        $data['rawPassword'] = array(
            'salt'     => $salt,
            'password' => $this->getPasswordEncoder()->encodePassword($data['password'], $salt)
        );
        $tokenType = 'email_password_reset';
        $EmailToken = $this->getTokenService()->makeToken($tokenType, array(
            'times'    => 5,
            'duration' => 60 * 30,
            'userId'   => $user['id'],
            'data'     => array(
                'userId' => $user['id'],
                'rawPassword' => array(
                    'salt'     => $salt,
                    'password' => $this->getPasswordEncoder()->encodePassword($data['password'], $salt)
                )
            )
        ));

        $url  = $this->getHttpHost().'/raw/password/update?'.http_build_query(array('token' => $EmailToken['token'], 'type' => $tokenType));
        $site = $this->getSettingService()->get('site', array());

        try {
            $mailOptions = array(
                'to'       => $data['email'],
                'template' => 'effect_email_reset_password',
                'params'   => array(
                    'nickname'  => $user['nickname'],
                    'verifyurl' => $url,
                    'sitename'  => $site['name'],
                    'siteurl'   => $site['url']
                )
            );

            $mail = MailFactory::create($mailOptions);
            $mail->send();
            $this->getLogService()->info('user', 'raw_password_update', "管理员给用户 ${user['nickname']}({$user['id']}) 发送密码重置邮件");

            return array(
                'code' => 0
            );
        } catch (\Exception $e) {
            return array(
                'code'    => '500',
                'message' => '邮箱发送失败'
            );   
        }
    }
    public function filter($res)
    {
        return $res;
    }

    protected function getSettingService()
    {
        return $this->getServiceKernel()->createService('System.SettingService');
    }

    protected function getPasswordEncoder()
    {
        return new MessageDigestPasswordEncoder('sha256');
    }

    protected function getUserService()
    {
        return $this->getServiceKernel()->createService('User.UserService');
    }

    protected function getLogService()
    {
        return $this->getServiceKernel()->createService('System.LogService');
    }

    protected function getTokenService()
    {
        return $this->getServiceKernel()->createService('User.TokenService');
    }
}