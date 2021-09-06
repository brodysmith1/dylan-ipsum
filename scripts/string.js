// Wrap string in a and b
export const wrap = (str,a,b) => `${a}${str}${b}`

// Format array of songlines into punctuated sentences
export const format = a =>
	a.map((str, i) => {
		if (i === a.length - 1) str.replace(/[,;]$/, ".")
		return str.match(/[^,!?:;\.(\.”)(\.")]$/) ? `${str}.` : str
	})
	.join(" ")
