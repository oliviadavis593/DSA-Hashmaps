/* Implementing a hash map */

class HashMap {
    constructor(initialCapacity=8) {
      //MAX_LOAD_RATIO = highest the ratio between length & capacity are allowed to reach
        this.length = 0;
        this._hashTable = []; //holds all of the data 
        //will grow in chunks as you resize to a larger array when the HT is full
        //This'll help to cut down the # of memory allocation that need to take place
        this._capacity = initialCapacity; 
        this._deleted = 0;
    }

    //This takes a string & hashes it = converts it to an integer (integer)
    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        }
        return hash >>> 0;
    }

    //set = initially checks whether load ratio is > than the given maximum
    //if load ratio is larger it resizes the hash map using price _resize()
    set(key, value) {
      const loadRatio = (this.length + this._deleted + 1) / this._capacity; 
      //M_L_R = keeps tack of how full the hash map is 
      //when its a certain % - we move to a biger hash table using SIZE_RATIO
      //M_L_R can minmize the chances that a value ends up a longs ways away from its hash position
      //due to the slot being almost totally full 
      if (loadRatio > HashMap.MAX_LOAD_RATIO) {
        this._resize(this._capacity * HashMap.SIZE_RATIO);
      }
      //Find the slot where this key should be in 
      const index = this._findSlot(key);

      if (!this._hashTable[index]) {
        this.length++
      }
      this._hashTable[index] = {
        key, 
        value, 
        DELETED: false
      };
    }

    //Helper function = used to find the correct slot for a given key 
    /*Big O: 
    1. Best & average O(1) => assuming hash function is good & load ratio is suitable (chances of needing to iterate should be low)
    2. Worst O(n) => as you have to linearly search through each slot 
     */
    _findSlot(key) {
       //hashString() = used to calculate the hash of the key
      const hash = HashMap._hashString(key);
      //uses moduluous to find a slot for the key within current capacity 
      const start = hash % this._capacity; 

      //loops through the array  
      //stops when it finds the slot w. a matching key or an empty slot
      for (let i = start; i < start + this._capacity; i++) {
        const index = i % this._capacity; 
        const slot = this._hashTable[index];
        if (slot === undefined || (slot.key === key && !slot.DELETED)) {
          return index; 
        }
      }
    }

    /* Resizing hash map */
    //To make sure that each item lives in the correct location = just recreate the HM from sratch w. larger capacity
    /*Big O: 
    1. Best & Average O(n) => you have to call set() 1 time for each item - & each set call is O(1)
    2. Worst O(n^2) 
     */
    _resize(size) {
      const oldSlot = this._hashTable; 
      this._capacity = size; 
      //Reset the length - it'll get rebuilt as you add the items back 
      this.length = 0; ;
      this._hashTable = [];

      for (const slot of oldSlot) {
        if (slot !== undefined) {
          this.set(slot.key, slot.value);
        }
      }
    }

    /* Deleting items */
    delete(key) {
      const index = this._findSlot(key);
      const slit = this._hashTable[index];
      if (slot === undefined) {
        throw new Error('Key error')
      }
      slot.DELETED = true; 
      this.length--; 
      this._deleted; 
    }
}