const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

// Подключение к базе данных
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключение к базе данных успешно.');
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Получение всех клиентов
app.get('/clients', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Добавление нового клиента
app.post('/clients', (req, res) => {
  const { first_name, last_name, middle_name } = req.body;
  db.run(
    'INSERT INTO clients (first_name, last_name, middle_name) VALUES (?, ?, ?)',
    [first_name, last_name, middle_name],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Получить все услуги
app.get('/services', (req, res) => {
  db.all('SELECT * FROM services', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Добавить новую услугу
app.post('/services', (req, res) => {
  const { name, type, cost } = req.body;

  if (!name || !type || !cost) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  const sql = 'INSERT INTO services (name, type, cost) VALUES (?, ?, ?)';
  db.run(sql, [name, type, parseFloat(cost)], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});


// Удалить услугу
app.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM services WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Услуга не найдена' });
    } else {
      res.status(204).end();
    }
  });
});

// Получение всех заказов
app.get('/orders', (req, res) => {
  const query = `
    SELECT 
      orders.id,
      clients.first_name,
      clients.last_name,
      services.name AS service_name,
      branches.name AS branch_name,
      orders.received_date,
      orders.return_date
    FROM orders
    JOIN clients ON orders.client_id = clients.id
    JOIN services ON orders.service_id = services.id
    JOIN branches ON orders.branch_id = branches.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});


// Добавление нового заказа
app.post('/orders', (req, res) => {
  const { client_id, service_id, branch_id, received_date } = req.body;

  if (!client_id || !service_id || !branch_id || !received_date) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const query = `INSERT INTO orders (client_id, service_id, branch_id, received_date) 
                 VALUES (?, ?, ?, ?)`;

  db.run(query, [client_id, service_id, branch_id, received_date], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const orderId = this.lastID;

      const fullQuery = `
        SELECT 
          orders.id,
          clients.first_name,
          clients.last_name,
          services.name AS service_name,
          branches.name AS branch_name,
          orders.received_date,
          orders.return_date
        FROM orders
        JOIN clients ON orders.client_id = clients.id
        JOIN services ON orders.service_id = services.id
        JOIN branches ON orders.branch_id = branches.id
        WHERE orders.id = ?`;

      db.get(fullQuery, [orderId], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json(row);
        }
      });
    }
  });
});




// Обновление даты возврата
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { return_date } = req.body;

  if (!return_date) {
    return res.status(400).json({ message: 'Дата возврата обязательна' });
  }

  const sql = `
    UPDATE orders 
    SET return_date = ? 
    WHERE id = ?
  `;
  db.run(sql, [return_date, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Заказ не найден' });
    } else {
      res.status(200).json({ message: 'Дата возврата обновлена' });
    }
  });
});

app.post('/branches', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Имя филиала обязательно' });
  }

  const query = `INSERT INTO branches (name) VALUES (?)`;

  db.run(query, [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, name });
    }
  });
});

app.get('/branches', (req, res) => {
  const query = `SELECT * FROM branches`;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.delete('/branches/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM branches WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Филиал не найден' });
    } else {
      res.status(204).end();
    }
  });
});

app.get('/branches/stats', (req, res) => {
  const query = `
    SELECT 
      branches.id,
      branches.name,
      COUNT(orders.id) AS order_count
    FROM branches
    LEFT JOIN orders ON branches.id = orders.branch_id
    GROUP BY branches.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});



// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
