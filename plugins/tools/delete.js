export default {
   names: ['Tools'],
   tags: ['delete'],
   command: ['delete', 'del', 'd'],
   start: async (m, {
      conn,
   }) => {
      conn.removeMessage(m);
   },
   premium: true
};
