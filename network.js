/**
 * The Neural Network learning the decision making
 */
class NeuralNetwork{
    
    constructor(neuronCounts) {
        // The network is actually an array of layers
        this.layers=[];
        for(let i=0; i < neuronCounts.length - 1; i++){
            // For the amount of elements in the neuronCounts array
            this.layers.push(new Layer(
                // InputNeurons, OutputNeurons
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }

    // Learn by using the feedForward of the Layer
    static feedForward(givenInputs,network) {
        // Calculate the outputs for the first layer
        let outputs = Layer.feedForward(
            givenInputs, network.layers[0]
        );
        for(let i=1; i < network.layers.length; i++){
            // And for each subsequent layer feed the output in again
            outputs = Layer.feedForward(
                outputs, network.layers[i]
            );
        }
        return outputs;
    }

    /**
     * Mutate a Neural Network with a given amount
     * @param {NeuralNetwork} network the net to mutate
     * @param {number} amount between 0 and 1 indicating the amount of mutation
     */
    static mutate(network, amount = 1) {
        network.layers.forEach(layer => {
            // For each layer, for all biases
            for(let i=0; i < layer.biases.length; i++){
                // interpolate between current value and a random
                // value between -1 and 1
                layer.biases[i] = lerp(
                    layer.biases[i],
                    Math.random() * 2 - 1,
                    amount
                )
            }
            // Do the same for the weights
            for(let i=0;i<layer.weights.length;i++){
                for(let j = 0; j < layer.weights[i].length; j++) {
                    layer.weights[i][j] = lerp(
                        layer.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        });
    }
}

class Layer{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        }

        Layer.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            }
            // Alternatively we can use : 
            // if(sum + level.biases[i] > 0) {
            //     level.outputs[i] = fun(sum + level.biases[i]) // ReLU
            // }else {
            //    level.outputs[i] = 0;
            //}

        }

        return level.outputs;
    }
}