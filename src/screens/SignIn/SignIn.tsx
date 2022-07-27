import React, { useState } from "react";
import { Alert } from "react-native";

import auth from "@react-native-firebase/auth";
import { Envelope, Key } from "phosphor-react-native";
import { Heading, Icon, VStack, useTheme } from "native-base";

import Logo from "../../assets/logo_primary.svg";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { isLoading } from "expo-font";

export const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const { colors } = useTheme();

  function handleSignIn() {
    if (!fields.email || !fields.password) {
      return Alert.alert("Entrar", "Informe seu email e senha");
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(fields.email, fields.password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);

        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/wrong-password"
        ) {
          return Alert.alert("Entrar", "Email ou senha inválida!");
        }

        if (error.code === "auth/user-not-found") {
          return Alert.alert("Entrar", "Usuário não cadastrado!");
        }

        return Alert.alert("Entrar", "Não foi possível acessar!");
      });
  }

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
        keyboardType="email-address"
      />

      <Input
        placeholder="Senha"
        mb={4}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={(text) => setFields({ ...fields, password: text })}
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
};
