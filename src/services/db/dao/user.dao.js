import userModel from "../models/user.model.js"

export default class UserServiceDao {
    constructor() {
        console.log("Working users with Database persistence in mongodb");
    }

    getAll = async () => {
        let users = await userModel.find();
        return users.map(user => user.toObject());
    }
    save = async (user) => {
        let result = await userModel.create(user);
        return result;
    }

    getBy = async (id) => {
        // Encuentra un documento de userModel por su ID
        // y popula el campo 'cart' de userModel que es una referencia a otros documentos.
        // Luego, utiliza .lean() para devolver un objeto plano de JavaScript en lugar de un documento de Mongoose.
   
        let result = await userModel.findOne({_id: id}).populate('cart').lean();
        return result;
    };

    findByUsername = async (username) => {
        const result = await userModel.findOne({ email: username });
        return result;
    };

    update = async (filter, value) => { 
        let result = await userModel.updateOne(filter, value);
        return result;
    };

    
    updateLastConnectionForUser = (userId, { lean } = {}) => {
        const currentDateUTC = new Date().toISOString(); // Obtiene la fecha y hora actual en formato UTC
        return this.updateUser(userId, { lastConnection: currentDateUTC }, { lean });
    }
    

    updateUser = async (id, user) => {
        delete user._id;
        let result = await userModel.updateOne({ _id: id }, { $set: user })
        return result;
    }

    // Extra
    randomUser = async () => {
        userModel.count().exec(function (err, resultCount) {
            var rand = Math.floor(Math.random() * resultCount);
            userModel.findOne().skip(rand).exec(function (err, result) {
                console.log(result);
            });
        });
    }

    getInactiveUsers = (inactiveTime, { lean } = {}) => {
        const currentDateUTC = new Date(Date.now() - inactiveTime).toISOString(); // Convierte el tiempo de inactividad a UTC
        return userModel.find({ lastConnection: { $lt: currentDateUTC } }, null, { lean });
    }
    


    removeUser = async (userId) => {
        let result = await userModel.findByIdAndDelete(userId);
        return result;
    }
   
}

