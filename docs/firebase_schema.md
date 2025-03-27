# Firebase Schema

This document describes the schema for the Firebase collections and documents used in the application.

## 1. Courses

*   Fields:
    *   `createdAt` (timestamp): The timestamp when the course was created.
    *   `description` (string): A description of the course.
    *   `name` (string): The name of the course.
    *   `questionCount` (number): The number of questions in the course.
    *   `questionTypes` (array of strings): An array of question types associated with the course.
    *   `updatedAt` (timestamp): The timestamp when the course was last updated.

## 2. Questions

*   Fields:
    *   `content` (string): The content of the question.
    *   `course` (string): The ID of the course that the question belongs to.
    *   `createdAt` (timestamp): The timestamp when the question was created.
    *   `difficulty` (string, enum: "easy", "medium", "hard"): The difficulty level of the question.
    *   `originalId` (string): The original ID of the question.
    *   `questionTypes` (array of strings): An array of question types associated with the question.
    *   `tags` (array of strings): An array of tags associated with the question.
    *   `timeEstimate` (number): The estimated time to answer the question in seconds.
    *   `title` (string): The title of the question.
    *   `updatedAt` (timestamp): The timestamp when the question was last updated.
    *   `userAnswer` (string): The user's answer to the question.

## 3. Tags

*   Fields:
    *   `color` (string): The color associated with the tag.
    *   `created_date` (timestamp): The timestamp when the tag was created.
    *   `name` (string): The name of the tag.
    *   `updated_date` (timestamp): The timestamp when the tag was last updated.

## Mermaid Diagram

```mermaid
erDiagram
    COURSE {
        timestamp createdAt
        string description
        string name
        number questionCount
        string[] questionTypes
        timestamp updatedAt
    }
    QUESTION {
        string content
        string course FK
        timestamp createdAt
        string difficulty
        string originalId
        string[] questionTypes
        string[] tags
        number timeEstimate
        string title
        timestamp updatedAt
        string userAnswer
    }
    TAG {
        string color
        timestamp created_date
        string name
        timestamp updated_date
    }
    QUESTION ||--o{ COURSE : belongs to
    QUESTION ||--o{ TAG : has