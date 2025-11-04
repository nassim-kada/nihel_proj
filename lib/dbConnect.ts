import mongoose from 'mongoose';
const MONGODB_URI= process.env.MONGODB_URI;
if(!MONGODB_URI){
    throw new Error('MONGO_URI not declared');
}
declare global{
    var _mongooseCache:{
        conn:typeof mongoose |null;
        promise: Promise<typeof mongoose> |null;
    } | undefined;
}
let cached = global._mongooseCache || {conn:null,promise:null};
export const dbConnect =async ()=>{
    if(cached.conn){
        return cached.conn;
    }
    if (!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI);
    }
    cached.conn = await cached.promise;
    global._mongooseCache= cached;
    return cached.conn;
}