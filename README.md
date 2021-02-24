# The Writing Tool (final name undecided)

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Usage](#usage)
4. [Screenshots](#screenshots)
5. [Dependencies](#dependencies)
6. [Technical Notes](#technical-notes)

## Introduction

The Writing Tool is an application that helps you organize your fictional content. With the app, you can record your concepts and ideas, organize stories, characters, outlines, moments of foreshadowing, backstories, and many more from the same place.

You can use it as a personal wiki of all your writing projects by adding links from one page to any other.

## Getting Started

1. Clone the repo.

  `git clone`

2. Go to the project directory and install all the front-end dependencies using:

  `yarn`

3. Run the front-end using:

  `yarn start`

4. Change the directory to `/api` and install all the back-end dependencies using:

  `pip3 install -r requirements.txt`

5. Run the back-end using:

  `python3 writersfriend.py`

6. To connect to the Mongo database, Open `/api/writersfriend.py` and:

  - Change the value of DATABASE to your database name.

  - Change the value of DATABASE_HOST to your database host.

7. Run your database server

The app runs by default on http://localhost:3000

## Usage

The home page opens with two default tabs, **Stories** and **Ideas**.

1. From the home page, you can add new **tabs**.

2. On each tab, you can add new **pages**.

3. While adding a **page**, you can select either **text** or **list**.

  - On a **List** page, you can add **tabs** and **pages** same as the home page.

  - On a **Text** page, you can write chapters, character descriptions, or any other text-based content.

4. You can also delete and edit pages and their titles.

## Screenshots

## Dependencies

### Tools

1. [Yarn](https://yarnpkg.com/)
2. [Python3+](https://www.python.org/downloads/)
3. [Pip](https://pip.pypa.io/en/stable/)
4. [MongoDB](https://www.mongodb.com/)

### Front-end

1. @material-ui/core ^4.11.3
2. @material-ui/icons ^4.11.2
3. @tinymce/tinymce-react ^3.10.1
4. react ^17.0.1
5. react-dom ^17.0.1
6. react-router-dom ^5.2.0
7. web-vitals ^1.0.1

### Back-end

1. certifi==2020.12.5
2. chardet==4.0.0
3. click==7.1.2
4. colorama==0.4.4
5. Flask==1.1.2
6. httpie==2.4.0
7. idna==2.10
8. itsdangerous==1.1.0
9. Jinja2==2.11.3
10. MarkupSafe==1.1.1
11. Pygments==2.8.0
12. pymongo==3.11.3
13. PySocks==1.7.1
14. requests==2.25.1
15. requests-toolbelt==0.9.1
16. urllib3==1.26.3
17. Werkzeug==1.0.1

## Technical Notes

1. Linking content between articles coming in the next version.
