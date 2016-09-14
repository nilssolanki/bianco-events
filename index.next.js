/**
 * The list of listeners, using DOM nodes as keys
 */
const listeners = new WeakMap()

/**
 * Split a string into several items separed by spaces
 * @param   { String } list - events list
 * @returns { Array } all the events detected
 */
const split = list => list.split(/\s/)

/**
 * Check if the action is add
 * @param   { String } methodName - method name
 * @returns { Boolean } is it an add event
 */
const isAdd = evName => methodName === 'addEventListener'

/**
 * Set a listener for all the events received separated by spaces
 * @param   { HTMLElement } el     - DOM node where the listeners will be bound
 * @param   { String }      evList - list of events we want to bind or unbind space separated
 * @param   { Function }    cb     - listeners callback
 * @param   { String }      method - either 'addEventListener' or 'removeEventListener'
 *  @param   { Object }      options - the event listener options
 */
function manageEvents(el, evList, cb, method, options) {
  if (!listeners.has(el)) {
    listeners.set(el, {})
  }
  
  split(evList).forEach((e) => {
    if (cb) {
      el[method](e, cb, false, options)
    }
    manageListeners(el, e, cb, method === 'addEventListener')
  })
}

/**
 * Add or remove listeners from the listener list
 * @param   { HTMLElement } el     - The current DOM node
 * @param   { String }      eventName - the name of the current event
 * @param   { Function }    cb     - The callback for the current event
 * @returns { Boolean } method – either 'addEventListener' or 'removeEventListener'
 */
function manageListeners(el, eventName, cb, method) {
  const elListeners = listeners.get(el)
  const eventListeners = elListeners[eventName] = elListeners[eventName] || []
  
  if (isAdd(method)) {
    eventListeners.push(cb)
  } else if (cb) {
    const cbIndex = eventListeners.indexOf(cb)
    eventListeners.splice(cbIndex, 1)
  } else {
    eventListeners.forEach((lcb) => {
      el[method](el, eventName, lcb)
    })
    Reflect.deleteProperty(elListeners, eventName)
  }
}

/**
 * Set a listener for all the events received separated by spaces
 * @param   { HTMLElement } el     - DOM node where the listeners will be bound
 * @param   { String }      evList - list of events we want to bind space separated
 * @param   { Function }    cb     - listeners callback
 * @returns { HTMLElement } DOM node and first argument of the function
 */
export function add(el, evList, cb, options) {
  manageEvents(el, evList, cb, 'addEventListener', options)
  return el
}

/**
 * Set a listener using from a list of events triggering the callback only once
 * @param   { HTMLElement } el     - DOM node where the listeners will be bound
 * @param   { String }      evList - list of events we want to bind space separated
 * @param   { Function }    cb     - listeners callback
 * @returns { HTMLElement } DOM node and first argument of the function
 */
export function once(el, evList, cb, options) {
  options = Object.assign(options, {
    once: true
  })
  manageEvents(el, evList, cb, 'addEventListener', options)
  return el
}

/**
 * Remove all the listeners for the events received separated by spaces
 * @param   { HTMLElement } el     - DOM node where the events will be unbind
 * @param   { String }      evList - list of events we want unbind space separated
 * @param   { Function }    cb     - listeners callback
 * @returns { HTMLElement } DOM node and first argument of the function
 */
export function remove(el, evList, cb) {
  manageEvents(el, evList, cb, 'removeEventListener')
  return el
}

export default {
  add,
  once,
  remove
}

