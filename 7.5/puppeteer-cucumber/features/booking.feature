Feature: Booking movie tickets 

  Scenario: Successful ticket booking
    Given I am on the homepage
    When I select the Tuesday tab
    And I choose a session
    And I select two seats
    And I click the "Забронировать" button
    Then I should see a confirmation with text "Вы выбрали билеты"

  Scenario: Trying to book a taken seat
    Given I am on the homepage
    When I choose a session with a taken seat
    And I try to click a taken seat
    Then the "Забронировать" button should be disabled

  Scenario: Booking a single seat
    Given I am on the homepage
    When I select the Tuesday tab
    And I choose a session
    And I select one seat
    And I click the "Забронировать" button
    Then I should see a confirmation with text "Вы выбрали билеты"
