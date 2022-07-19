import React, { useState } from "react";
import { Heading, Icon, VStack, useTheme } from "native-base";

import { Envelope, Key } from "phosphor-react-native";

import Logo from "../../assets/logo_primary.svg";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export const SignIn: React.FC = () => {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const { colors } = useTheme();

  const handleSignIn = () => {};

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color={"gray.100"} fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={(text) => setFields({ ...fields, email: text })}
      />

      <Input
        placeholder="Senha"
        mb={4}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={(text) => setFields({ ...fields, password: text })}
      />

      <Button title="Entrar" w="full" />
    </VStack>
  );
};
