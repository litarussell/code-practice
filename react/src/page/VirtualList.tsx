import React from 'react';
import { VirtualList } from '../component';

const generateData = (num = 1000) => {
  const data = new Array(num)
  for (let i = 0; i < data.length; i++) {
    data[i] = { id: `id_${i}`, value: `value_${i}` }
  }
  return data;
};

export default () => {
  const data = generateData();
  return (
    <div style={{height: '100%'}}>
      <VirtualList data={data} size={10} windowSize={20} renderItem={({ id, value }) => {
        return (
          <div className='list-item'>
            <span>{value}</span>
          </div>
        );
      }} />
    </div>
  );
};