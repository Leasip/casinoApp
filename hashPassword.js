const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
};

hashPassword('password123');
