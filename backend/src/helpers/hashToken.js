import crypto from 'node:crypto';

const hashToken = (token) => {
    //hash the token using sha256 algorithm
    // return crypto.createHash('sha256').update(token.toString).digest('hex');

    //esto me lo dio chatgpt : 
    
        return crypto.createHash("sha256").update(token).digest("hex");
    
}

export default hashToken;