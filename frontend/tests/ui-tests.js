const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Test 1: UI Elements and Navigation Test
async function uiElementsTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Navigate to the application
    await driver.get('http://localhost:3000');
    
    // Check if login form elements are present
    const emailField = await driver.findElement(By.name('email'));
    const passwordField = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.xpath('//button[text()="Login"]'));
    
    assert(emailField, 'Email field found');
    assert(passwordField, 'Password field found');
    assert(loginButton, 'Login button found');
    
    // Check if we can switch to register mode
    const registerLink = await driver.findElement(By.xpath('//span[text()="Register"]'));
    await registerLink.click();
    
    // Wait for register form to appear
    await driver.wait(until.elementLocated(By.name('username')), 5000);
    const usernameField = await driver.findElement(By.name('username'));
    const registerButton = await driver.findElement(By.xpath('//button[text()="Register"]'));
    
    assert(usernameField, 'Username field found in register mode');
    assert(registerButton, 'Register button found');
    
    // Switch back to login
    const loginLink = await driver.findElement(By.xpath('//span[text()="Login"]'));
    await loginLink.click();
    
    // Verify we're back to login mode
    await driver.wait(until.elementLocated(By.xpath('//button[text()="Login"]')), 5000);
    
    console.log(' UI Elements and Navigation test passed');
  } finally {
    await driver.quit();
  }
}

// Test 2: Form Validation Test
async function formValidationTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Navigate to the application
    await driver.get('http://localhost:3000');
    
    // Try to submit empty login form
    const loginButton = await driver.findElement(By.xpath('//button[text()="Login"]'));
    await loginButton.click();
    
    // The form should have HTML5 validation preventing submission
    // Check if we're still on the same page (login page)
    await driver.wait(until.elementLocated(By.name('email')), 3000);
    
    // Fill in email but leave password empty
    const emailField = await driver.findElement(By.name('email'));
    await emailField.sendKeys('test@example.com');
    await loginButton.click();
    
    // Should still be on login page due to validation
    await driver.wait(until.elementLocated(By.name('password')), 3000);
    
    console.log(' Form Validation test passed');
  } finally {
    await driver.quit();
  }
}

// Run tests
(async function runTests() {
  try {
    console.log(' Starting UI Tests...');
    await uiElementsTest();
    await formValidationTest();
    console.log(' All UI tests passed!');
    console.log(' Note: These tests verify UI functionality without requiring database connection');
  } catch (error) {
    console.error(' Test failed:', error);
    process.exit(1);
  }
})();