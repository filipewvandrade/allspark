const { writeFile } = require('./file');
const generator = require('./generator');
const project = require('./project');
const log = require('./log');

function loadConfig(args) {
    try {
        log.verbose("Reading config");
        return require(args.configPath);
    } catch (err) {
        log.error("Couldn't load the config file")
        log.error(err);
        process.exit(-1);
    }
}

function run(args) {
    const config = loadConfig(args);
    log.verbose("Performing budget calc...");
    const budget = project.calculation(config);
    log.verbose("Generating template and writing payload...");
    const content = generator.template({
        customerName: config.customerName,
        features: config.features,
        totalTime: budget.totalTime,
        taxAmount: budget.taxAmount,
        amount: budget.amount,
        cost: budget.cost,
    });
    log.verbose("Budget created, generating file...");
    const success = writeFile(args.outputDir, "budget.html", content);

    if (success) {
        log.info("Done!");
        process.exit(0);
    }

    log.error("Erro!");
    process.exit(-1);

}

module.exports = {
    run
}