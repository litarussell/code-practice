import React, {useState, useEffect, useRef, useCallback} from 'react';

import './index.less'

const throttle = (fn, delay) => {
  let flag = true;
  return () => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn();
      flag = true;
    }, delay);
  }
}

export default ({ renderItem, size = 10, windowSize = 20, data }) => {
  const rootRef = useRef();
  const translateRef = useRef();
  const [currentViewList, setCurrentViewList] = useState([]);
  const [translateY, setTranslateY] = useState(0);
  const viewListIndex = useRef({
    startIndex: 0,
    lastIndex: 0,
  });
  useEffect(() => {
    viewListIndex.current.lastIndex = windowSize - 1
    setCurrentViewList(data.slice(0, windowSize));
  }, [])

  useEffect(() => {
    const el: any = rootRef.current;
    const translateEl: any = translateRef.current;
    let oldTop = 0;
    const handle = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const { top, bottom, height } = translateEl.getBoundingClientRect();
      if (scrollTop > oldTop) { // 向下滚动
        if (scrollTop + clientHeight === scrollHeight) { // 滚动到底部
          setCurrentViewList((pre) => {
            const {lastIndex} = viewListIndex.current;
            setTranslateY(102 * (lastIndex + 1 - size));
            viewListIndex.current.startIndex += size;
            viewListIndex.current.lastIndex += size;
            return [...pre.slice(size, size*2), ...data.slice(lastIndex+1, lastIndex+1+size)]
          });
        }
      } else {  // 向上滚动
        console.log('top:', top, scrollTop, height, (scrollTop - scrollTop % height) / height)
        if (top >= 0) { // 滚动到顶部
          const {startIndex, lastIndex} = viewListIndex.current;
          if (startIndex === 0) {
            return;
          }
          let sIndex: number, eIndex: number, offset: number;
          if (top > clientHeight) { // 快速
            const page = (scrollTop - scrollTop % height) / height + (scrollTop % height === 0 ? 0 : 1) - 1
            console.log('>>', page)
          }
          // else {
            sIndex = startIndex - size < 0 ? 0 : startIndex - size;
            eIndex = lastIndex - (startIndex - sIndex) + 1;
            offset = size
          // }
          setCurrentViewList(() => {
            setTranslateY(102 * sIndex);
            viewListIndex.current.startIndex -= offset;
            viewListIndex.current.lastIndex -= offset;
            return [...data.slice(sIndex, eIndex)];
          });
        }
      }
      oldTop = scrollTop;
    };
    const handleScroll = throttle(handle, 300);

    el.addEventListener('scroll', handleScroll, false);
    return () => {
      el.removeEventListener('scroll', handleScroll, false);
    }
  }, []);

  return (
    <div className='virtual-list' ref={rootRef}>
      <div ref={translateRef} style={{transform: `translate(0, ${translateY}px)`}}>
        {currentViewList.map((item) => renderItem(item))}
      </div>
      {/* <div className='list-item' style={{transform: `translate(0, 1000px)`}}>
        <span>test</span>
      </div> */}
    </div>
  );
}
