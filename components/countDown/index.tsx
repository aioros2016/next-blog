/*
 * @Author: lizhigang
 * @Date: 2023-04-16 13:18:47
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';

interface CountDownProps {
  time?: number;
  onEnd?: () => void;
}
const CountDown = ({ time = 10, onEnd }: CountDownProps) => {
  const [count, setCount] = useState(time);

  useEffect(() => {
    if (count <= 0) {
      onEnd?.();
      return;
    }
    const timer = setTimeout(() => {
      setCount((preState) => preState - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <Button size="large" disabled>
      {count}秒后重新发送
    </Button>
  );
};

export default CountDown;
