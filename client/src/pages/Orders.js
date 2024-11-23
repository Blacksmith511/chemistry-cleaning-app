import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText } from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    client_id: '',
    service_id: '',
    branch_id: '',
    received_date: ''
  });

  const [branches, setBranches] = useState([]);
  const [branchStats, setBranchStats] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchBranches();
    fetchBranchStats();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:5000/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Ошибка при получении заказов:', error));
  };

  const fetchBranches = () => {
    axios.get('http://localhost:5000/branches')
      .then(response => setBranches(response.data))
      .catch(error => console.error('Ошибка при получении филиалов:', error));
  };

  const fetchBranchStats = () => {
    axios.get('http://localhost:5000/branches/stats')
      .then(response => setBranchStats(response.data))
      .catch(error => console.error('Ошибка при получении статистики по филиалам:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/orders', newOrder)
      .then(() => {
        fetchOrders(); // Обновляем список заказов
        setNewOrder({ client_id: '', service_id: '', branch_id: '', received_date: '' });
      })
      .catch(error => console.error('Ошибка при добавлении заказа:', error));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Заказы
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="ID клиента"
            type="number"
            value={newOrder.client_id}
            onChange={(e) => setNewOrder({ ...newOrder, client_id: e.target.value })}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="ID услуги"
            type="number"
            value={newOrder.service_id}
            onChange={(e) => setNewOrder({ ...newOrder, service_id: e.target.value })}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth required>
            <InputLabel>Выберите филиал</InputLabel>
            <Select
              value={newOrder.branch_id}
              onChange={(e) => setNewOrder({ ...newOrder, branch_id: e.target.value })}
            >
              <MenuItem value="" disabled>
                Выберите филиал
              </MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <TextField
            label="Дата получения"
            type="date"
            value={newOrder.received_date}
            onChange={(e) => setNewOrder({ ...newOrder, received_date: e.target.value })}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Добавить заказ
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Список заказов
        </Typography>
        <List>
          {orders.map(order => (
            <ListItem key={order.id}>
              <ListItemText
                primary={`${order.first_name} ${order.last_name} - ${order.service_name} (${order.branch_name})`}
                secondary={`Принято: ${order.received_date} | Возврат: ${order.return_date || 'ещё не возвращено'}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Статистика по филиалам
        </Typography>
        <List>
          {branchStats.map((branch) => (
            <ListItem key={branch.id}>
              <ListItemText
                primary={`${branch.name}: ${branch.order_count} заказ(ов)`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Orders;
