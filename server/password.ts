const bcrypt = require('bcrypt');

async function checkPassword(password:string, hashedPassword:string): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

async function hashPassword(password:string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS||'10'));
    return hashedPassword;
}

export { checkPassword, hashPassword };