import neo4j from 'neo4j-driver';

let driver = null;

/**
 * Safely converts Neo4j data types (e.g. Integer, Node, Relationship) into native JS objects.
 */
export function toNative(val) {
  if (val === null || val === undefined) {
    return val;
  }
  if (neo4j.isInt(val)) {
    return val.inSafeRange() ? val.toNumber() : val.toString();
  }
  if (Array.isArray(val)) {
    return val.map(toNative);
  }
  if (typeof val === 'object') {
    // Check if it's a Neo4j Node/Relationship with properties
    if (val.properties) {
      const obj = { ...toNative(val.properties) };
      if (val.labels) obj._labels = val.labels;
      if (val.type) obj._type = val.type;
      return obj;
    }
    const result = {};
    for (const key of Object.keys(val)) {
      result[key] = toNative(val[key]);
    }
    return result;
  }
  return val;
}

export function isDbConfigured() {
  const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
  const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;
  return Boolean(uri && password && !uri.includes('your-instance-id'));
}

export function getDriver() {
  if (!driver) {
    const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
    const user = process.env.COGNODB_USER || process.env.NEO4J_USERNAME || process.env.NEO4J_USER || 'cognodb';
    const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;

    if (!uri || !password) {
      throw new Error('Database connection credentials missing. Please set COGNODB_URI and COGNODB_PASSWORD.');
    }

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      disableLosslessIntegers: true,
      maxConnectionPoolSize: 50,
      connectionTimeout: 10000
    });
  }
  return driver;
}

export async function executeQuery(cypher, params = {}) {
  const session = getDriver().session();
  try {
    const result = await session.executeRead(tx => tx.run(cypher, params));
    return result.records;
  } catch (error) {
    console.error('[CognoDB Error] Query execution failed:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

export async function executeWrite(cypher, params = {}) {
  const session = getDriver().session();
  try {
    const result = await session.executeWrite(tx => tx.run(cypher, params));
    return result.records;
  } catch (error) {
    console.error('[CognoDB Error] Write execution failed:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

export async function verifyConnection() {
  if (!isDbConfigured()) {
    return { connected: false, reason: 'unconfigured' };
  }
  try {
    const records = await executeQuery('RETURN 1 AS ping');
    const isOk = records.length > 0 && records[0].get('ping') === 1;
    return { connected: isOk, reason: isOk ? 'connected' : 'unknown' };
  } catch (err) {
    return { connected: false, reason: 'error', error: err.message };
  }
}
