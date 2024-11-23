import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ first_name: '', last_name: '', middle_name: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios.get('http://localhost:5000/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Ошибка при получении клиентов:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/clients', newClient)
      .then(() => {
        fetchClients(); // Обновляем список клиентов
        setNewClient({ first_name: '', last_name: '', middle_name: '' }); // Очищаем форму
      })
      .catch(error => console.error('Ошибка при добавлении клиента:', error));
  };

  const handleDeleteClient = (id) => {
    axios.delete(`http://localhost:5000/clients/${id}`)
      .then(() => fetchClients()) // Обновляем список после удаления
      .catch(error => console.error('Ошибка при удалении клиента:', error));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Список клиентов
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Box mb={2}>
          <TextField
            label="Имя"
            name="first_name"
            value={newClient.first_name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Фамилия"
            name="last_name"
            value={newClient.last_name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Отчество"
            name="middle_name"
            value={newClient.middle_name}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Добавить клиента
        </Button>
      </form>

      <Box mt={4}>
        <List>
          {clients.map(client => (
            <ListItem key={client.id} secondaryAction={
              <Button
                color="error"
                onClick={() => handleDeleteClient(client.id)}
                startIcon={<DeleteIcon />}
              >
                Удалить
              </Button>
            }>
              <ListItemText
                primary={`${client.first_name} ${client.last_name} ${client.middle_name}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Clients;
