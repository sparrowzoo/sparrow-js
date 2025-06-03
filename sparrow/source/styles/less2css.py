import os
def auto_less_to_css(file_dir):
    all_whole_path_files = []
    for root, dirs, files in os.walk(file_dir):
        for file in files:
            try:
                if file[-5:] == ".less":
                    file_info = [root+'/', file]
                    all_whole_path_files.append(file_info)
            except Exception as e:
                print(e)

    for file_info in all_whole_path_files:
        less_file_path_file = file_info[0] + file_info[1]
        css_file_name = file_info[1][:-5] + '.css'
        css_file_path_file = file_info[0] + css_file_name
        new_command = 'lessc ' + less_file_path_file + ' > ' + css_file_path_file

        print new_command
        try:
            result = os.popen(new_command).readlines()
            if len(result) == 0:
                print(less_file_path_file, "convert to ", css_file_path_file)
        except Exception as e:
            print(e)

def main():
    auto_less_to_css('.')

if __name__ == '__main__':
    main()
