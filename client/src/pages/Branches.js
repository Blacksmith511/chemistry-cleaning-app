import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Card, CardContent, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/branches')
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  const handleAddBranch = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBranch }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBranches([...branches, data]);
        setNewBranch('');
      });
  };

  const handleDeleteBranch = (id) => {
    fetch(`http://localhost:5000/branches/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setBranches(branches.filter((branch) => branch.id !== id));
    });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom align="center">
          Филиалы
        </Typography>

        <form onSubmit={handleAddBranch} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <TextField
            label="Название филиала"
            variant="outlined"
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginLeft: '10px' }}
          >
            Добавить
          </Button>
        </form>

        <List>
          {branches.map((branch) => (
            <ListItem key={branch.id} component="div">
              <Card style={{ width: '100%' }}>
                <CardContent>
                  <ListItemText
                    primary={branch.name}
                    secondary="Описание филиала (при необходимости)"
                  />
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteBranch(branch.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Branches;
