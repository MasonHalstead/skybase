module.exports = async function() {
  try {
    console.log('Building Table Schema')
  } catch (err) {
    throw new Error('Error building table schema');
  }
};
