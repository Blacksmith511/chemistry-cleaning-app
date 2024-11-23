import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', type: '', cost: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axios.get('http://localhost:5000/services')
      .then(response => setServices(response.data))
      .catch(error => console.error('Ошибка при получении услуг:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/services', newService)
      .then(() => {
        fetchServices(); // Обновляем список услуг
        setNewService({ name: '', type: '', cost: '' }); // Очищаем форму
      })
      .catch(error => console.error('Ошибка при добавлении услуги:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/services/${id}`)
      .then(() => fetchServices())
      .catch(error => console.error('Ошибка при удалении услуги:', error));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Список услуг
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <Box mb={2}>
          <TextField
            label="Название услуги"
            name="name"
            value={newService.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Тип услуги"
            name="type"
            value={newService.type}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Стоимость"
            name="cost"
            type="number"
            value={newService.cost}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>

        <Button variant="contained" color="primary" type="submit">
          Добавить услугу
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Услуги
        </Typography>
        <List>
          {services.map(service => (
            <ListItem key={service.id} secondaryAction={
              <Button color="secondary" onClick={() => handleDelete(service.id)}>
                Удалить
              </Button>
            }>
              <ListItemText
                primary={`${service.name} (${service.type})`}
                secondary={`${service.cost}₸`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Services;
