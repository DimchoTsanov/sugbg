/**
 *  global flag that enable or disable the logging
 */
let logToConsole: boolean = true;

/**
 * log string message to console. 
 */
export function DebugLog(message: string) {
    if (logToConsole) {
        console.log(message);
    }
}

/**
 * log  message and object to console. 
 */
export function DebugLogWithMessage(message: string, obj: any) {
    if (logToConsole) {
        console.log(message);
        console.log(obj);
    }
}