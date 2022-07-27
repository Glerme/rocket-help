import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import {
  CircleWavyCheck,
  Clipboard,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";
import { HStack, Text, VStack, useTheme, ScrollView, Box } from "native-base";

import { OrderFirestore } from "../../types/OrderFirestore";

import { firebaseDateFormat } from "../../functions/firestoreDateFormat";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { OrderProps } from "../../components/Order";
import { CardDetails } from "../../components/CardDetails";

interface RouteParams {
  orderId: string;
}

interface OrderDetailsProps extends OrderProps {
  description: string;
  solution: string;
  closed: string;
}

export const Details: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const [order, setOrder] = useState<OrderDetailsProps | null>(null);

  const route = useRoute();

  const { orderId } = route.params as RouteParams;

  function handleCloseOrder() {
    if (!solution) {
      Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação."
      );
    }

    firestore()
      .collection<OrderFirestore>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação.");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestore>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          createdAt,
          closedAt,
          solution,
        } = doc.data();

        const closed = closedAt ? firebaseDateFormat(closedAt) : null;

        setOrder({
          id: orderId,
          patrimony,
          description,
          status,
          solution,
          when: firebaseDateFormat(createdAt),
          closed,
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setIsLoading(false);

        return Alert.alert("Erro", "Ocorreu um erro ao buscar o chamado");
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent={"center"} p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finalizado" : "Em Andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={Clipboard}
        />

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button title="Encerrar solicitação" onPress={handleCloseOrder} m={5} />
      )}
    </VStack>
  );
};
