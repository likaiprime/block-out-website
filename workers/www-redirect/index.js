// www.blockout.cc -> blockout.cc, keeping path and query.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = "blockout.cc";
    return Response.redirect(url.toString(), 301);
  },
};
