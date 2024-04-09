import mongoose from 'mongoose';

const QueueRegister = new mongoose.Schema(
  {
    user: 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    verified: {
      type: Boolean,
      default: false
    },

}, {timestamps:true});


const QueueRegistration = mongoose.model('QueueRegister', QueueRegister);

export default QueueRegistration;