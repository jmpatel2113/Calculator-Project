const keys = document.querySelectorAll('.key');   // all key elements are assigned here
const display_input = document.querySelector('.display .input');  // all input text elements are assigned here
const display_output = document.querySelector('.display .output'); // all output text elements are assigned here
let input = "";
let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

for(let key of keys){                               // iterates through all "key" elements
    const value = key.dataset.key;                  // obtains the value from "data-key" attributes

    key.addEventListener('click', () => {          // whenever user clicks on a key
        if(value == 'clear'){                      // if "AC" key clicked
            input = "";                            // clears the input line
            display_input.innerHTML = "";          // updates input text line
            display_output.innerHTML = "";         // updates output text line
        }
        else if(value == "backspace"){             // if "<" key clicked
            input = input.slice(0, -1);            // slices away the last character
            display_input.innerHTML = cleanInput(input);               // checks for user-friendly input line
        }
        else if(value == "="){
            cleanInput(input);
            let result = eval(input);              // calculation
            if((result == "" && result != "0") || result == "Infinity"){     // for undefined results such as 1/0
                result = "Undefined";
            }
            display_output.innerHTML = cleanOutput(result);            // checks and updates it into user-friendly output line
        }
        else if(value == "brackets"){       
            last_bracket = input.slice(-1);
            // checks that both opening and closing brackets are matching
            if(input.indexOf("(") == -1 || input.indexOf("(") != -1 && input.indexOf(")") != -1 && input.lastIndexOf("(") < input.lastIndexOf(")")){
                if((input.length > 0 && last_bracket == ")") || numbers.includes(last_bracket)){
                    input += " * ("            // converts user-input "8(9)" to "8x(9)"
                }
                else{
                    input += "(";
                }
                
            }
            else if(input.indexOf("(") != -1 && input.indexOf(")") == -1 || input.indexOf("(") != -1 && input.indexOf(")") != -1 && input.lastIndexOf("(") > input.lastIndexOf(")")){
                if(last_bracket == "(" || !numbers.includes(last_bracket)){ // for avoiding (), empty brackets, must have something inside brackets
                    input += "";
                }
                else{
                    input += ")";
                }
            }

            display_input.innerHTML = cleanInput(input);
        }
        else{
            if(validateInput(value)){
                let last_character = input.slice(-1);
                if(value == "." && (last_character == ""/* || last_character == " "*/)){   // want = 8 x 0.8, input = 8 x .8
                    input += "0"
                }
                if(numbers.includes(value) && last_character == ")"){   // for converting input text "(8)9" to "(8)x9"
                    input += " * "
                }
                input += value;
                display_input.innerHTML = cleanInput(input);
            }
        }
    })
}

function cleanInput(input){
    let input_array = input.split("");                  // splits the passed in string into each character
    let input_array_length = input_array.length;
    
    for(let i = 0; i < input_array_length; i++){        // iterates through each char, updates the operators to make it user-friendly
        if(input_array[i] == "*"){    
            input_array[i] = ` <span class="operator">x</span> `;
        }
        else if(input_array[i] == "/"){
            input_array[i] = ` <span class="operator">÷</span> `;
        }
        else if(input_array[i] == "+"){
            input_array[i] = ` <span class="operator">+</span> `;
        }
        else if(input_array[i] == "-"){
            input_array[i] = ` <span class="operator">-</span> `;
        }
        else if(input_array[i] == "("){
            input_array[i] = `<span class="operator">(</span>`;
        }
        else if(input_array[i] == ")"){
            input_array[i] = `<span class="operator">)</span>`;
        }
        else if(input_array[i] == "%"){
            input_array[i] = `<span class="operator"> modulo </span>`;
        }
    }

    return input_array.join("");                        // joins and returns the string array as one whole string
}

function cleanOutput(output){
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];         // output after decimal
    output_string = output_string.split(".")[0];       // output before decimal

    let output_array = output_string.split("");        // converts before decimal string into array

    // adds "," to longer output such as 10,000, ignores undefined and scientific notation results such as 5e-15
    if(output_array.length > 3 && output_string != "NaN" && output_string != "Undefined" && !output_string.includes("e")){
        for(let i = output_array.length-3; i > 0; i -= 3){          
            output_array.splice(i, 0, ",");
        }
    }

    // if there was a decimal point in output, it would combine after adding ","
    if(decimal){         
        output_array.push(".");
        output_array.push(decimal);
    }
    
    return output_array.join("");
}

function validateInput(value){           // fixes all the bugs in input text line
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/", "%"];
    let keyActions = ["(", ")", "%"];
    let operatorPattern = new RegExp(operators.map(operator => "\\" + operator).join("|"), "g");       // makes a pattern for operators
    let numbersArray = input.split(operatorPattern);                          // uses that pattern to split the input into an array of all numbers
    let decimalArray = new Array(numbersArray.length).fill(true);         // fills entire array with True bool value
    let operatorCount = numbersArray.length-1;

    for(let i = 0; i < numbersArray.length; i++){  // for validating decimal inputs
        if(numbersArray[i].includes(".")){
            decimalArray[i] = false;
        }
    }
    if(value == "."){   // validates the decimal input
        if(decimalArray[operatorCount] == true){
            decimalArray[operatorCount] = false;
            return true;
        }
        return false;     // would not input if user, for eg, wants to enter ".." or "8.8."
    }

    if((value == "%" && last_input == "(")){ // avoid entering "( modulo "
        return false;
    }

    if(operators.includes(value)){ // for avoid repeating operators
        if(operators.includes(last_input) || last_input == ""){
            return false;
        }
        else{
            return true;
        }
    }

    if(keyActions.includes(value)){ // for avoid repeating "key actions"
        if(keyActions.includes(last_input)){
            return false;
        }
        if(value == '%' && last_input == "%"){
            return false;
        }   
    }

    return true;

}