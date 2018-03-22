'use strict'
const CID = require('cids');
const multihashes = require('multihashes');
const { keccak256 } = require('leofcoin-hash');

/**
 * @callback SerializeCallback
 * @param {?Error} error - Error if serialization failed
 * @param {?Buffer} binaryBlob - Binary Leofcoin block if serialization was
 *   successful
 */
/**
 * Serialize internal representation into a binary Leofcoin block.
 *
 * @param {LeofcoinBlock} dagNode - Internal representation of a Leofcoin block
 * @param {SerializeCallback} callback - Callback that handles the
 *   return value
 * @returns {void}
 */
const serialize = (dagNode, callback) => {
  let err = null
  let binaryBlob
  try {
    binaryBlob = dagNode.toBuffer()
  } catch (serializeError) {
    err = serializeError
  } finally {
    callback(err, binaryBlob)
  }
}

/**
 * @callback DeserializeCallback
 * @param {?Error} error - Error if deserialization failed
 * @param {?LeofcoinBlock} dagNode - Internal representation of a Leofcoin block
 *   if deserialization was successful
 */
/**
 * Deserialize Leofcoin block into the internal representation,
 *
 * @param {Buffer} binaryBlob - Binary representation of a Leofcoin block
 * @param {DeserializeCallback} callback - Callback that handles the
 *   return value
 * @returns {void}
 */
const deserialize = (binaryBlob, callback) => {
  let err = null
  let dagNode
  try {
    dagNode = binaryBlob.toString();
  } catch (deserializeError) {
    err = deserializeError
  } finally {
    callback(err, dagNode)
  }
}

/**
 * @callback CidCallback
 * @param {?Error} error - Error if getting the CID failed
 * @param {?CID} cid - CID if call was successful
 */
/**
 * Get the CID of the DAG-Node.
 *
 * @param {LeofcoinBlock} dagNode - Internal representation of a Leofcoin block
 * @param {CidCallback} callback - Callback that handles the return value
 * @returns {void}
 */
const cid = (dagNode, callback) => {
  let err = null;
  let cid;
  try {
    // Leofcoin double hashes
    const firstHash = keccak256(dagNode.toBuffer(true));
    const hash = keccak256(Buffer.from(firstHash));

    cid = hashToCid(Buffer.from(hash));
  } catch (cidError) {
    err = cidError;
  } finally {
    callback(err, cid);
  }
}

// Convert a Leofcoin hash (as Buffer) to a CID
const hashToCid = (hash) => {
  const multihash = multihashes.encode(hash, 'keccak-256');
  const cidVersion = 1;
  return new CID(cidVersion, 'leofcoin-block', multihash);
}

module.exports = {
  hashToCid: hashToCid,
  // Public API
  cid: cid,
  deserialize: deserialize,
  serialize: serialize
}
