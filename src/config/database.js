// In-memory database (using arrays to simulate a database)
const database = {
  users: [],
  preferences: [],
  favorites: []
};

// Helper functions for database operations
const db = {
  // User operations
  users: {
    findAll: () => database.users,
    
    findById: (id) => database.users.find(user => user.id === id),
    
    findByEmail: (email) => database.users.find(user => user.email === email),
    
    create: (userData) => {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
      };
      database.users.push(newUser);
      return newUser;
    },
    
    update: (id, userData) => {
      const index = database.users.findIndex(user => user.id === id);
      if (index !== -1) {
        database.users[index] = { ...database.users[index], ...userData };
        return database.users[index];
      }
      return null;
    },
    
    delete: (id) => {
      const index = database.users.findIndex(user => user.id === id);
      if (index !== -1) {
        database.users.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  // User preferences operations
  preferences: {
    findByUserId: (userId) => database.preferences.find(pref => pref.userId === userId),
    
    create: (userId, preferencesData) => {
      const newPreferences = {
        id: Date.now().toString(),
        userId,
        ...preferencesData,
        createdAt: new Date()
      };
      database.preferences.push(newPreferences);
      return newPreferences;
    },
    
    update: (userId, preferencesData) => {
      const index = database.preferences.findIndex(pref => pref.userId === userId);
      if (index !== -1) {
        database.preferences[index] = { 
          ...database.preferences[index], 
          ...preferencesData,
          updatedAt: new Date()
        };
        return database.preferences[index];
      }
      return null;
    }
  },

  // Favorites operations
  favorites: {
    findByUserId: (userId) => database.favorites.filter(fav => fav.userId === userId),
    
    create: (userId, article) => {
      const newFavorite = {
        id: Date.now().toString(),
        userId,
        article,
        createdAt: new Date()
      };
      database.favorites.push(newFavorite);
      return newFavorite;
    },
    
    delete: (userId, articleUrl) => {
      const index = database.favorites.findIndex(
        fav => fav.userId === userId && fav.article.url === articleUrl
      );
      if (index !== -1) {
        database.favorites.splice(index, 1);
        return true;
      }
      return false;
    },
    
    exists: (userId, articleUrl) => {
      return database.favorites.some(
        fav => fav.userId === userId && fav.article.url === articleUrl
      );
    }
  }
};

module.exports = db;