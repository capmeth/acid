
let re = /[.*+\-?^${}()|[\]\\]/g;
/**
    Escape regular expression special characters (from MDN).
    
    @param { string } string
      String to be escaped.
    @return { string }
      A string that can be used in a regular expression to match `string`.
*/
export default function(string)
{
    return string.replace(re, '\\$&');
}
