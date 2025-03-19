import os

def main():
	# list all files in current working directory
	files_in_directory = os.listdir()
	# ignore non-html files and ignore index.html
	html_files = [f for f in files_in_directory if f.endswith('.html') and not f.startswith('index.html')]
	
	index_template = """
<html>
    <head>
        <title>G Nav Senasa Maps</title>
    </head>
    <body>
        <h1>G Nav Senasa Maps</h1>
            [list_items]
    </body>
</html>
"""
	unordered_list = '<ul>\n'
	for file in html_files:
		unordered_list += f'<li><a href="{file}">map for question {file.replace(".html", "")}<a/></li>\n'
	unordered_list += '</ul>'
	
	index_template = index_template.replace('[list_items]', unordered_list)

	with open('index.html', 'w') as index_file:
		index_file.write(index_template)
if __name__ == '__main__':
	main()
