var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLInt = require('graphql').GraphQLInt;
var contaType = require('../types/ContaType');
var ContaModel = require('../../models/Conta');
const { errorName } = require('../../constants');

exports.sacar = {
    type: contaType.ContaType,
    args: {
        conta: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        valor: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: async(root, args) => {
        var query = {conta: args.conta};
        const conta = await ContaModel.findOne(query);
        if (!conta) {
            throw new Error(errorName.ACCOUNTNOTEXIST);
        }

        if (args.valor > conta["saldo"]) {
            throw new Error(errorName.UNAUTHORIZED);
        } else if (args.valor <= 0) {
            throw new Error(errorName.VALORZEROSAQUE);
        }
        var valorAtualizado = conta["saldo"] - args.valor;
        const UpdatedConta = await ContaModel.findByIdAndUpdate(conta["id"], {saldo: valorAtualizado}, {new: true});
        if (!UpdatedConta) {
            throw new Error(errorName.UPDATEERROR)
        }
        return UpdatedConta;
        
    }
}