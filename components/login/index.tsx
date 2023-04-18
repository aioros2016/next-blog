/*
 * @Author: lizhigang
 * @Date: 2023-04-16 12:21:41
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CountDown from '../countDown';
import request from 'service/base';

interface LoginProps {
  show: boolean;
  onClose: () => void;
}

const { Option } = Select;
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="86">+86</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
);
const Login = ({ show, onClose }: LoginProps) => {
  const [form] = Form.useForm();
  const [isCountDownStart, setIsCountDownStart] = useState(false);

  const countDownStart = async () => {
    try {
      const phone = form.getFieldValue('phone');
      console.log(phone);
      if (!phone) {
        message.error('请输入手机号');
        return;
      }
      setIsCountDownStart(true);
      const { code, data, msg } = await request.post('/api/user/captcha', {
        to: phone,
        templateId: 1,
      });
      if (code !== 0) {
        message.warning(msg);
      }
    } catch (error) {
      message.error(error.msg);
    }
  };

  const handleCountDownEnd = () => {
    setIsCountDownStart(false);
  };
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { phone, captcha } = values;
    try {
      const { code, msg } = await request.post('/api/login', {
        phone,
        captcha,
        identityType: 'phone',
      });
      if (code === 0) {
        message.success(msg);
        onClose();
      } else {
        message.error(msg);
      }
    } catch (error) {
      message.error(error.msg);
    }
  };

  return (
    <Modal title="验证码登录" open={show} footer={false} onCancel={onClose}>
      <Form
        form={form}
        name="login"
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ prefix: '86' }}
        scrollToFirstError
      >
        <Form.Item
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input
            size="large"
            placeholder="请输入手机号"
            addonBefore={prefixSelector}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                ]}
              >
                <Input size="large" placeholder="请输入验证码" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              {isCountDownStart ? (
                <CountDown time={10} onEnd={handleCountDownEnd} />
              ) : (
                <Button type="primary" size="large" onClick={countDownStart}>
                  获取验证码
                </Button>
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Row gutter={8}>
            <Col span={24}>
              其他登录：
              <span className={styles.iconWrapper}>
                <GithubOutlined />
              </span>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('必须同意隐私协议')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            注册登录即表示同意 <a href="">隐私协议</a>
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button size="large" type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
