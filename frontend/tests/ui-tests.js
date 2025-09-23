const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Test 1: Login functionality
async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Navigate to the application
    await driver.get('http://localhost:3000');
    
    // Find email and password fields and login button
    const emailField = await driver.findElement(By.name('email'));
    const passwordField = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.xpath('//button[text()="Login"]'));
    
    // Enter credentials
    await emailField.sendKeys('test@example.com');
    await passwordField.sendKeys('password123');
    
    // Click login
    await loginButton.click();
    
    // Wait for dashboard to load and check if welcome message appears
    await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(), "Welcome,")]')), 10000);
    
    const welcomeMessage = await driver.findElement(By.xpath('//h2[contains(text(), "Welcome,")]')).getText();
    assert(welcomeMessage.includes('Welcome,'), 'Login successful');
    
    console.log('Login test passed');
  } finally {
    await driver.quit();
  }
}

// Test 2: Add task functionality
async function addTaskTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // First login
    await driver.get('http://localhost:3000');
    const emailField = await driver.findElement(By.name('email'));
    const passwordField = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.xpath('//button[text()="Login"]'));
    
    await emailField.sendKeys('test@example.com');
    await passwordField.sendKeys('password123');
    await loginButton.click();
    
    // Wait for dashboard to load
    await driver.wait(until.elementLocated(By.name('title')), 10000);
    
    // Fill task form
    const titleField = await driver.findElement(By.name('title'));
    const descriptionField = await driver.findElement(By.name('description'));
    const addButton = await driver.findElement(By.xpath('//button[text()="Add Task"]'));
    
    await titleField.sendKeys('Test Task');
    await descriptionField.sendKeys('This is a test task created by Selenium');
    await addButton.click();
    
    // Wait for task to appear in the list - using h4 inside task-item
    await driver.wait(until.elementLocated(By.xpath('//h4[contains(text(), "Test Task")]')), 10000);
    
    const taskTitle = await driver.findElement(By.xpath('//h4[contains(text(), "Test Task")]')).getText();
    assert.strictEqual(taskTitle, 'Test Task', 'Task added successfully');
    
    console.log('Add task test passed');
  } finally {
    await driver.quit();
  }
}

// Run tests
(async function runTests() {
  try {
    await loginTest();
    await addTaskTest();
    console.log('All UI tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();