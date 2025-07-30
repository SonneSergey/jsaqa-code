Feature: Ticket Booking

  Scenario: Successful booking of two seats on Tuesday
    Given I open the booking website
    When I select Tuesday
    And I choose the first available session
    And I select two free seats
    And I click the "Book" button
    Then I should see the booking confirmation

  Scenario: The "Book" button is inactive without seat selection
    Given I open the booking website
    When I select Sunday
    And I choose the first available session
    Then the "Book" button should be inactive
