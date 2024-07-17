const main = require('./index');

module.exports = {

    async incrementDb(dbPath, defaultValue, incrementValue) {
        const has = await main.getDatabase().has(dbPath);

        if (has) {
            const value = await main.getDatabase().get(dbPath) + incrementValue;

            await main.getDatabase().set(dbPath, value);

            return value
        }


        const value = defaultValue + incrementValue;

        await main.getDatabase().set(dbPath, value);

        return value;
    }

}
