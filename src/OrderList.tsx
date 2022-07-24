import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Coffee from '@mui/icons-material/Coffee';
import {drinks, IOrder} from './App';
import {Checkbox} from '@mui/material';

export default function OrderList({orders, handleToggle}: { orders: IOrder[], handleToggle: (order: IOrder) => void }) {

  return (
    <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
      {orders.map((order: IOrder) => (
        <ListItem key={order.id} secondaryAction={
              <Checkbox
                edge="end"
                onChange={() => handleToggle(order)}
                checked={order.complete}
              />
            }>
          <ListItemAvatar>
            <Avatar>
              <img src={drinks.filter((x) => x.id === order.order)[0].icon} style={{ width: '80%'}}/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${order.order} - ${order.user}`}
            secondary={order.orderTime?.toDate().toLocaleTimeString()}
          />
        </ListItem>
      ))}

    </List>
  );
}
