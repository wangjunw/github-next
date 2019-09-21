const Redis = require('ioredis');
const redis = new Redis({
    prot: 6379
});
let test = async () => {
    const keys = await redis.keys('*');
    await redis.set('c', 123);
    console.log(await redis.get('c'));
};
test();
