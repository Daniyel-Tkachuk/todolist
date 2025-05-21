import React, {ChangeEvent, useState} from 'react';

type Props = {

}

export const Input = ({}: Props) => {
  const [value, setValue] = useState("");

  const changeValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  }

  return (
    <input type="text" value={value} onChange={changeValueHandler}/>
  );
};

