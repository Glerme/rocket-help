import { useState } from "react";
import { Alert } from "react-native";

import { VStack } from "native-base";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export const Register: React.FC = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({
    patrimony: "",
    description: "",
  });

  function handleNewOrderRegister() {
    if (!fields.description || !fields.patrimony) {
      return Alert.alert("Registrar", "Preencha todos os campos!");
    }

    setIsLoading(true);

    firestore()
      .collection("orders")
      .add({
        patrimony: fields.patrimony,
        description: fields.description,
        status: "open",
        // Proprio firebase coloca o createdAt do servidor
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada com sucesso!");

        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        Alert.alert("Solicitação", "Não foi possível registrar a solicitação!");
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova Solicitação" />

      <Input
        placeholder="Número do patrimônio"
        mt={4}
        value={fields.patrimony}
        onChangeText={(text) => setFields({ ...fields, patrimony: text })}
      />

      <Input
        placeholder="Descrição"
        mt={5}
        flex={1}
        multiline
        textAlignVertical="top"
        value={fields.description}
        onChangeText={(text) => setFields({ ...fields, description: text })}
      />

      <Button
        title="Cadastrar"
        mt={5}
        onPress={handleNewOrderRegister}
        isLoading={isLoading}
      />
    </VStack>
  );
};
