# Convert stupid line endings
cat words.txt  | sed -e 's/\r/\n/g' > words_fixed.txt

# Shorten to 4-9 length words
for word in $(cat words_fixed.txt); do [[ ${#word} -lt 4 || ${#word} -gt 9 ]] && continue; echo "\"$word\","; done > words_shortened3.txt
