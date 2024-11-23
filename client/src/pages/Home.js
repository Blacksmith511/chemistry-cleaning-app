import React from 'react';
import { Container, Typography, Button, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          Добро пожаловать!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Выберите одну из страниц для работы с системой.
        </Typography>
        <Stack spacing={2} direction="column" alignItems="center" mt={3}>
          <Button
            component={Link}
            to="/orders"
            variant="contained"
            color="primary"
            size="large"
          >
            Заказы
          </Button>
          <Button
            component={Link}
            to="/branches"
            variant="contained"
            color="secondary"
            size="large"
          >
            Филиалы
          </Button>
          <Button
            component={Link}
            to="/clients"
            variant="contained"
            color="success"
            size="large"
          >
            Клиенты
          </Button>
          <Button
            component={Link}
            to="/services" // ссылка на страницу услуг
            variant="contained"
            color="info"
            size="large"
          >
            Услуги
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default HomePage;
