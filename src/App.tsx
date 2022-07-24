import React, {useEffect, useState} from 'react';
import americano from "./images/americano.png";
import espresso from "./images/espresso.png";
import icedCoffee from "./images/iced-coffee.png";
import tea from "./images/tea-cup.png";
import macha from "./images/green-tea.png";
import cappu from "./images/coffee-cup.png";

// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
  collection,
  updateDoc,
  doc,
  addDoc,
  getFirestore,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  query,
  where,
  orderBy
} from "firebase/firestore";

import OrderList from './OrderList';
import {Box, Button, Container, Typography} from '@mui/material';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLb8lDraHIBMY5Mp2JlI1NBfzJze43FAc",
  authDomain: "coffeeshop-40c87.firebaseapp.com",
  projectId: "coffeeshop-40c87",
  storageBucket: "coffeeshop-40c87.appspot.com",
  messagingSenderId: "94291970258",
  appId: "1:94291970258:web:58bb98c3ca2df99a13050b",
  measurementId: "G-E01RPCZN7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export interface IOrder {
  id: string,
  user: string,
  order: string,
  complete: boolean,
  orderTime: Timestamp | null,
  orderCompleteTime: Timestamp | null,
}

// https://www.flaticon.com/packs/coffee-129
interface IDrink {
  id: string,
  name: string,
  icon: string,
}

export const drinks: IDrink[] = [
  {
    id: "americano",
    name: "Americano",
    icon: americano,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    icon: cappu,
  },
  {
    id: "espresso",
    name: "Espresso",
    icon: espresso,
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    icon: icedCoffee,
  },
  {
    id: "tea",
    name: "Tea",
    icon: tea,
  },
  {
    id: "macha",
    name: "Macha",
    icon: macha,
  },
]


function App() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const db = getFirestore(app);
  const ordersCollection = collection(db, 'orders');

  useEffect(() => {
    const oneHourAgo = Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));

    const q = query(
      ordersCollection,
      where("orderTime", ">", oneHourAgo),
      orderBy("orderTime", "desc"),
    );
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((order) => (
        {id: order.id, ...order.data()} as IOrder
      ));
      setOrders(data);
    });
  }, [])

  const addOrder = async (order: string) => {

    await addDoc(ordersCollection, {
      order: order,
      user: "ron",
      orderTime: serverTimestamp(),
      complete: false,
      orderCompleteTime: null,
    });
  }


  const handleToggle = async (order: IOrder) => {
    await updateDoc(doc(ordersCollection, order.id), {
      complete: !order.complete,
      orderCompleteTime: serverTimestamp(),
    })
  };

  return (
    <div className="App">
      <Box sx={{display: 'flex'}}>
        {drinks.map((drink: IDrink) => (
          <Button key={drink.id} onClick={() => addOrder(drink.id)}>
            <img src={drink.icon} style={{width: 64}}/>
            <Typography sx={{ml: 2}}>{drink.name}</Typography>
          </Button>
        ))}
      </Box>
      <Container maxWidth="md">
        <OrderList orders={orders} handleToggle={handleToggle}/>
      </Container>
    </div>
  );
}

export default App;
