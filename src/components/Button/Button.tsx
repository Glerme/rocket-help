import React from "react";

import { Button as NativeBaseButton, Heading, IButtonProps } from "native-base";

interface ButtonProps extends IButtonProps {
  title: string;
}

export const Button: React.FC<ButtonProps> = ({ title, ...rest }) => {
  return (
    <NativeBaseButton
      bg="green.700"
      h={14}
      fontSize="sm"
      rounded="sm"
      _pressed={{ bg: "green.500" }}
      {...rest}
    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </NativeBaseButton>
  );
};
