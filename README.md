# Home Challenge
Tech challenge for home.ht

### Instructions
To install and run locally:
- `docker-compose up`
- To run tests: `npm run test`
- To run on local machine: `npm run dev`
    - navigate to `http://localhost:3000/api/v1/test`

#### Notes
- The first few commits regarding setting up the project contain mostly reused code from my own projects which I use as boiler plate for new APIs.

#### Assumptions
- The API is based on the assumption that the data model is like I implemented here in this project, as per my understanding of the challenge description.

#### Improvements to do
- Add more validations for inputs, specifically:
    - parseInt on param check
    - data validation on update and create endpoints
- Add more tests for different edge cases
- Add configs for prod environment
