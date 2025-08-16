import React from 'react';
import { InputProps } from './Models/models';
import { Input } from '@material-tailwind/react';

const InputComponent = (props: InputProps) => {
  const elementInstance = props.elementcomponent; // Create an instance of the elementComponent

  if (!!props.elementcomponent) {
    let y = React.createElement<InputProps>(elementInstance??"", { ...props })
    const { ['elementcomponent']: elementcomponent, ...userWithoutElementcomponent } = y.props
    let clone = { ...y , props:{...userWithoutElementcomponent}};
    return clone
  } else {
    const { ['elementcomponent']: elementcomponent, ...userWithoutElementcomponent } = props
    return <Input onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={""} {...userWithoutElementcomponent} />;
  }
};

export default InputComponent;